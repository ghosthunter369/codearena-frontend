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

export interface Question {
  /** @format int64 */
  id?: number;
  title?: string;
  content?: string;
  tags?: string[];
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export interface QuestionInput {
  title: string;
  content: string;
  tags?: string[];
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export interface ApiResponse {
  code?: number;
  msg?: string;
  data?: object;
}
