/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SearchRequest {
  keyword: string;
  type?: "QUESTION" | "USER" | "ALL";
  /** @default 1 */
  page?: number;
  /** @default 10 */
  size?: number;
}

export interface SearchResponse {
  code?: number;
  msg?: string;
  data?: SearchResult;
}

export interface SearchResult {
  total?: number;
  items?: SearchItem[];
}

export interface SearchItem {
  id?: number;
  title?: string;
  content?: string;
  type?: string;
}

export interface ApiResponse {
  code?: number;
  msg?: string;
  data?: object;
}
