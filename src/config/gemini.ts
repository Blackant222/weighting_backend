import { GoogleGenAI } from '@google/genai';
import { config } from './index';
import { HttpsProxyAgent } from 'https-proxy-agent';

const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const fetchOptions = proxyUrl ? {
  fetch: (url: string, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      // @ts-ignore
      agent: new HttpsProxyAgent(proxyUrl)
    });
  }
} : {};

export const ai = new GoogleGenAI({ 
  apiKey: config.gemini.apiKey,
  ...fetchOptions
});
export const FAST_MODEL = 'gemini-2.5-flash';
