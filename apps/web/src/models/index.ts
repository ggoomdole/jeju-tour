export interface BaseResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
}
