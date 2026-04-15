import { test as base } from '@playwright/test';

// 공통 fixture — 추후 API 모킹, 인증 상태 등 확장
export const test = base.extend({});

export { expect } from '@playwright/test';
