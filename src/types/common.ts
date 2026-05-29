export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface ApiError {
  status: number;
  message: string;
}
