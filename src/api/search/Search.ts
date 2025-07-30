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

import { ApiResponse, SearchRequest, SearchResponse } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Search<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Search
   * @name SearchContent
   * @summary Search content
   * @request POST:/search
   */
  searchContent = (data: SearchRequest, params: RequestParams = {}) =>
    this.request<SearchResponse, any>({
      path: `/search`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Search
   * @name GetSearchSuggestions
   * @summary Get search suggestions
   * @request GET:/search/suggestions
   */
  getSearchSuggestions = (
    query: {
      keyword: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponse, any>({
      path: `/search/suggestions`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
