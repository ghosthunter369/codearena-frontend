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

export interface User {
  /** @format int64 */
  id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  role?: "USER" | "ADMIN";
  /** @format date-time */
  createTime?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface UserResponse {
  code?: number;
  msg?: string;
  data?: User;
}

export interface LoginResponse {
  code?: number;
  msg?: string;
  data?: {
    token?: string;
    user?: User;
  };
}

export interface ApiResponse {
  code?: number;
  msg?: string;
  data?: object;
}
