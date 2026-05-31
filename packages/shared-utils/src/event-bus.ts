/**
 * Cross-service event bus on top of Kafka.
 * Provides a typed handler registry so a service can register
 * `onPaymentCompleted(handler)` without manually wiring consumers.
 */

import { Consumer } from 'kafkajs';
import { BankerOSEvent } from '@bankeros/shared-types';
import { createConsumer, TOPICS } from './kafka';

type EventHandler<T = unknown> = (event: BankerOSEvent<T>) => Promise<void>;

export class EventBus {
  private handlers = new Map<string, EventHandler[]>();
  private consumer: Consumer | null = null;

  constructor(private readonly serviceName: string) {}

  on<T = unknown>(eventType: string, handler: EventHandler<T>): this {
    if (!this.handlers.has(eventType)) this.handlers.set(eventType, []);
    this.handlers.get(eventType)!.push(handler as EventHandler);
    return this;
  }

  async start(topics: string[] = Object.values(TOPICS)): Promise<void> {
    this.consumer = await createConsumer(`${this.serviceName}-group`);
    await this.consumer.subscribe({ topics, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const event = JSON.parse(message.value.toString()) as BankerOSEvent;
          const handlers = this.handlers.get(event.eventType) ?? [];

          if (handlers.length === 0) return;

          await Promise.all(handlers.map(async (h) => {
            try {
              await h(event);
            } catch (err) {
              console.error(
                `[EventBus:${this.serviceName}] Handler failed for ${event.eventType}:`,
                err,
              );
            }
          }));
        } catch (err) {
          console.error(`[EventBus:${this.serviceName}] Bad message on ${topic}:${partition}`, err);
        }
      },
    });

    console.log(`[EventBus:${this.serviceName}] Listening on topics: ${topics.join(', ')}`);
  }

  async stop(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
  }
}
