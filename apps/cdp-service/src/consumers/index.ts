/**
 * CDP Service consumers — ingests all business events into the
 * customer 360° platform for analytics and ML feature extraction.
 */

import { EventBus } from '@bankeros/shared-utils/src/event-bus';
import { TOPICS } from '@bankeros/shared-utils/src/kafka';

// In-memory feature store (production: Feast or Tecton)
const featureStore = new Map<string, Record<string, unknown>>();

function updateFeature(cifId: string, key: string, value: unknown) {
  const features = featureStore.get(cifId) ?? {};
  features[key] = value;
  features['updatedAt'] = new Date().toISOString();
  featureStore.set(cifId, features);
}

export function getFeatures(cifId: string) {
  return featureStore.get(cifId) ?? null;
}

export async function startCdpConsumers(): Promise<void> {
  const bus = new EventBus('cdp-service');

  bus.on<{ cifId: string }>('CUSTOMER_CREATED', async (event) => {
    updateFeature(event.payload.cifId, 'accountCreatedAt', event.occurredAt);
  });

  bus.on<{ paymentId: string; debtorAccountId?: string; amount?: { amount: string } }>(
    'PAYMENT_COMPLETED',
    async (event) => {
      const cifId = event.metadata.userId ?? 'unknown';
      const features = featureStore.get(cifId) ?? {};
      const txCount = (features.paymentCount as number ?? 0) + 1;
      const totalVolume = parseFloat((features.totalPaymentVolume as string ?? '0')) + parseFloat(event.payload.amount?.amount ?? '0');
      updateFeature(cifId, 'paymentCount', txCount);
      updateFeature(cifId, 'totalPaymentVolume', totalVolume.toFixed(2));
      updateFeature(cifId, 'lastPaymentAt', event.occurredAt);
    },
  );

  bus.on<{ loanId: string; cifId: string; amount: string }>('LOAN_DISBURSED', async (event) => {
    updateFeature(event.payload.cifId, 'hasActiveLoan', true);
    updateFeature(event.payload.cifId, 'latestLoanAmount', event.payload.amount);
  });

  await bus.start();
}
