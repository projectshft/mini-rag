# API and Rate Limits

The Northwind Notes API lets you read and write notes from your own scripts.

## Authentication

Create an API token in Settings, then Developer. Send it in the Authorization header as a Bearer token. Tokens do not expire, but you can revoke them at any time.

## Rate limits

Free accounts can make 60 requests per minute. Pro accounts can make 600 requests per minute. When you go over the limit, the API returns HTTP 429 with a Retry-After header that says how many seconds to wait.

## Pagination

List endpoints return 50 items per page by default and at most 200. Use the cursor value from the response to fetch the next page.

## Webhooks

Webhooks fire when a note is created, updated, or deleted. Failed webhook deliveries are retried 5 times with exponential backoff, then dropped.
