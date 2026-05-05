import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';

describe('QuoteService', () => {
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteService],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return non-standard for custom pallet', async () => {
    const payload = {
      palletType: 'custom',
      dimensions: { length: 120, width: 80, height: 150 },
      weight: 500,
      sender: { postalCode: '00-001', country: 'PL' },
      recipient: { postalCode: '30-001', country: 'PL' },
    };

    const result = await service.calculateQuote(payload);
    expect(result.isNonStandard).toBe(true);
    expect(result.results.length).toBe(0);
  });

  it('should return non-standard for oversized pallet', async () => {
    const payload = {
      palletType: 'euro',
      dimensions: { length: 120, width: 80, height: 250 },
      weight: 1200,
      sender: { postalCode: '00-001', country: 'PL' },
      recipient: { postalCode: '30-001', country: 'PL' },
    };

    const result = await service.calculateQuote(payload);
    expect(result.isNonStandard).toBe(true);
    expect(result.results.length).toBe(0);
  });

  it('should return non-standard for pallets above automatic dimension limits', async () => {
    const payload = {
      palletType: 'euro',
      dimensions: { length: 120, width: 80, height: 251 },
      weight: 500,
      sender: { postalCode: '00-001', country: 'PL' },
      recipient: { postalCode: '30-001', country: 'PL' },
    };

    const result = await service.calculateQuote(payload);
    expect(result.isNonStandard).toBe(true);
    expect(result.results.length).toBe(0);
  });
});
