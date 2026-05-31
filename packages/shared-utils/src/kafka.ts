import { Kafka, Producer, Consumer, KafkaConfig, logLevel } from 'kafkajs';
import { BankerOSEvent } from '@bankeros/shared-types';

export const TOPICS = {
  CUSTOMER_EVENTS:    'bankeros.customer.events',
  ACCOUNT_EVENTS:     'bankeros.account.events',
  PAYMENT_EVENTS:     'bankeros.payment.events',
  LOAN_EVENTS:        'bankeros.loan.events',
  COMPLIANCE_EVENTS:  'bankeros.compliance.events',
  JOURNAL_EVENTS:     'bankeros.journal.events',
  BATCH_EVENTS:       'bankeros.batch.events',
} as const;

let kafka: Kafka | null = null;

function getKafka(): Kafka {
  if (!kafka) {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    const config: KafkaConfig = {
      clientId: process.env.SERVICE_NAME || 'bankeros-service',
      brokers,
      logLevel: logLevel.WARN,
    };
    kafka = new Kafka(config);
  }
  return kafka;
}

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = getKafka().producer({ idempotent: true });
    await producer.connect();
  }
  return producer;
}

export async function publishEvent<T>(topic: string, event: BankerOSEvent<T>): Promise<void> {
  const p = await getProducer();
  await p.send({
    topic,
    messages: [
      {
        key: event.aggregateId,
        value: JSON.stringify(event),
        headers: {
          'event-type': event.eventType,
          'correlation-id': event.metadata.correlationId,
        },
      },
    ],
  });
}

export async function createConsumer(groupId: string): Promise<Consumer> {
  const consumer = getKafka().consumer({ groupId });
  await consumer.connect();
  return consumer;
}

export async function disconnectKafka(): Promise<void> {
  if (producer) { await producer.disconnect(); producer = null; }
}
