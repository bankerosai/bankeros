import { prisma } from '@bankeros/database';
import { KycStatus, RiskLevel } from '@bankeros/shared-types';

interface SanctionsHit {
  matched: boolean;
  matchScore: number;
  listName: string;
  entry?: Record<string, unknown>;
}

export class KycService {
  async screenSanctions(cifId: string, name: string, country: string): Promise<SanctionsHit[]> {
    // Integration point for real sanctions providers (e.g., Dow Jones, Refinitiv)
    // Stub implementation — replace with actual API call in production
    const hits: SanctionsHit[] = [];

    const HIGH_RISK_COUNTRIES = ['IR', 'KP', 'SY', 'CU', 'VE'];
    const isPep = false; // Would call PEP screening API
    const isSanctioned = false; // Would call OFAC/UN/EU list API

    await prisma.sanctionsScreeningResult.create({
      data: {
        entityType: 'CUSTOMER',
        entityId: cifId,
        name,
        matchScore: isSanctioned ? 0.98 : 0.0,
        listName: 'OFAC',
        isPep,
        isMatch: isSanctioned,
      },
    });

    if (HIGH_RISK_COUNTRIES.includes(country)) {
      hits.push({ matched: true, matchScore: 1.0, listName: 'HIGH_RISK_JURISDICTION' });
    }

    return hits;
  }

  determineRiskLevel(country: string, pepFlag: boolean, sanctionsHits: SanctionsHit[]): RiskLevel {
    if (sanctionsHits.some((h) => h.matched && h.matchScore > 0.9)) return RiskLevel.PROHIBITED;
    if (pepFlag) return RiskLevel.HIGH;
    const HIGH_RISK = ['IR', 'KP', 'SY', 'CU', 'AF', 'MM', 'SD'];
    if (HIGH_RISK.includes(country)) return RiskLevel.HIGH;
    const MEDIUM_RISK = ['RU', 'CN', 'VN', 'PK', 'NG'];
    if (MEDIUM_RISK.includes(country)) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  async triggerEdd(cifId: string, reason: string): Promise<void> {
    await prisma.complianceCase.create({
      data: {
        caseNumber: `EDD-${Date.now()}`,
        customerId: cifId,
        type: 'EDD',
        status: 'OPEN',
        description: `Enhanced Due Diligence triggered: ${reason}`,
      },
    });
  }

  async updateKycStatus(cifId: string, status: KycStatus, reason?: string): Promise<void> {
    await prisma.customer.update({
      where: { id: cifId },
      data: { kycStatus: status },
    });

    if (status === KycStatus.APPROVED) {
      await prisma.account.updateMany({
        where: { customerId: cifId, status: 'PENDING' },
        data: { status: 'ACTIVE' },
      });
    }
  }
}
