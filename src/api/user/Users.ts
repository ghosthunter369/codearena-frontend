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

import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, UserResponse } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Users<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags User
   * @name GetCurrentUser
   * @summary Get current user info
   * @request GET:/users/current
   */
  getCurrentUser = (params: RequestParams = {}) =>
    this.request<UserResponse, any>({
      path: `/users/current`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name LoginUser
   * @summary User login
   * @request POST:/users/login
   */
  loginUser = (data: LoginRequest, params: RequestParams = {}) =>
    this.request<LoginResponse, any>({
      path: `/users/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name RegisterUser
   * @summary User registration
   * @request POST:/users/register
   */
  registerUser = (data: RegisterRequest, params: RequestParams = {}) =>
    this.request<ApiResponse, any>({
      path: `/users/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
