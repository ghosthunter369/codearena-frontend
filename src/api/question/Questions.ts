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

import { ApiResponse, QuestionInput } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Questions<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Question
   * @name GetQuestions
   * @summary Get all questions
   * @request GET:/questions
   */
  getQuestions = (params: RequestParams = {}) =>
    this.request<ApiResponse, any>({
      path: `/questions`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Question
   * @name CreateQuestion
   * @summary Create a new question
   * @request POST:/questions
   */
  createQuestion = (data: QuestionInput, params: RequestParams = {}) =>
    this.request<ApiResponse, any>({
      path: `/questions`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
