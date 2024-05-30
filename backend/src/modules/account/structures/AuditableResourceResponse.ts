export class AuditableResourceResponse<T> {
  oldResource?: T
  resource: T
}