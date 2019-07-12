export interface Preview {
  src?: string | ArrayBuffer;
  error?: boolean;
  message?: string;
  file?: File;
  name?: string;
}
