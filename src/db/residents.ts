// Simulated residents database
import type { Resident } from '../types';

const FILLER_BASE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function makeFiller(targetBytes: number): string {
  let s = '';
  while (Buffer.byteLength(s) < targetBytes) s += FILLER_BASE + ' ';
  return s.slice(0, targetBytes);
}

function makeResident(id: number): Resident {
  const approxDataBytes = 900;
  return {
    id,
    first_name: `First${id}`,
    last_name: `Last${id}`,
    email: `user${id}@example.com`,
    phone: `+1-555-01${String(id % 10000).padStart(4, '0')}`,
    address: `123 Main St Apt ${id}`,
    city: `City${id % 1000}`,
    state: `ST`,
    postal_code: String(10000 + (id % 90000)),
    notes: makeFiller(approxDataBytes),
  };
}

export async function fetchAllResidents(count: number): Promise<Resident[]> {
  const arr = new Array<Resident>(count);
  for (let i = 0; i < count; i++) arr[i] = makeResident(i + 1);
  return arr;
}



