import { LRU } from 'tiny-lru';

export const autocompleteCache = new LRU<string[]>(100);
