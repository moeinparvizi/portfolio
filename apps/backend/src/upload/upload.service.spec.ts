import { ConfigService } from '@nestjs/config';
import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { UploadService } from './upload.service';

// Jest's CJS loader cannot load uuid's ESM entry; keep real UUID generation.
jest.mock('uuid', () => ({ v4: () => require('node:crypto').randomUUID() }));

describe('UploadService cloud storage', () => {
  let server: Server;
  let root: string;
  let storageUrl: string;
  let responseStatus: number;
  let received: { url?: string; authorization?: string; contentType?: string; body?: Buffer };

  beforeEach(async () => {
    root = mkdtempSync(join(tmpdir(), 'portfolio-upload-'));
    responseStatus = 200;
    received = {};
    server = createServer(async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      received = {
        url: req.url,
        authorization: req.headers.authorization,
        contentType: req.headers['content-type'],
        body: Buffer.concat(chunks),
      };
      res.writeHead(responseStatus, { 'Content-Type': 'application/json' });
      res.end('{}');
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    storageUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    rmSync(root, { recursive: true, force: true });
  });

  function service() {
    return new UploadService(new ConfigService({
      SUPABASE_URL: storageUrl,
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
      SUPABASE_STORAGE_BUCKET: 'portfolio-images',
      UPLOAD_DIR: join(root, 'local-uploads'),
    }));
  }

  async function image() {
    return {
      mimetype: 'image/png',
      buffer: await sharp({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } }).png().toBuffer(),
    };
  }

  it('stores the converted image remotely and returns its public URL without local disk writes', async () => {
    const url = await service().processImage(await image());
    expect(url).toMatch(new RegExp(`^${storageUrl}/storage/v1/object/public/portfolio-images/[^/]+\\.webp$`));
    expect(received.url).toMatch(/^\/storage\/v1\/object\/portfolio-images\/[^/]+\.webp$/);
    expect(received.authorization).toBe('Bearer test-service-key');
    expect(received.contentType).toBe('image/webp');
    expect((await sharp(received.body).metadata()).format).toBe('webp');
    expect(existsSync(join(root, 'local-uploads'))).toBe(false);
  });

  it('rejects a failed remote upload instead of returning a broken image URL', async () => {
    responseStatus = 500;
    await expect(service().processImage(await image())).rejects.toThrow();
  });
});
