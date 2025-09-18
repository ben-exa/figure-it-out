
const http: any = require('http');
const url: any = require('url');

import { fetchAllResidents } from './db/residents';
import { toCsvHeader, toCsvRow } from './lib/csv';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

function parseCount(reqUrl: string): number {
  const parsed = url.parse(reqUrl, true);
  const raw = parsed.query?.count as string | undefined;
  const def = 10000; 
  const n = raw ? Number(raw) : def;
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.floor(n);
}

function notFound(res: any) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not Found');
}

function logMemory(prefix = 'mem') {
  const m = process.memoryUsage();
  const rss = Math.round(m.rss / (1024 * 1024));
  const heapUsed = Math.round(m.heapUsed / (1024 * 1024));
  const heapTotal = Math.round(m.heapTotal / (1024 * 1024));
  console.log(`[${prefix}] rss=${rss}MB heapUsed=${heapUsed}MB heapTotal=${heapTotal}MB`);
}

const server = http.createServer(async (req: any, res: any) => {
  const { pathname } = url.parse(req.url, true);

  if (pathname === '/residents/export.csv') {
    const count = parseCount(req.url);
    console.log(`Starting export for count=${count}`);
    logMemory('before');

    const rows = await fetchAllResidents(count);

    const header = toCsvHeader();
    const body = rows.map(toCsvRow).join('');
    const csv = header + body;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="residents.csv"');
    res.setHeader('Cache-Control', 'no-store');
    res.end(csv);
    logMemory('after');
    return;
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


setInterval(() => logMemory('tick'), 80).unref();

