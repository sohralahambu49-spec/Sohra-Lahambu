
export enum GraduationStatus {
  LULUS = 'LULUS',
  TIDAK_LULUS = 'TIDAK_LULUS',
  TERTUNDA = 'TERTUNDA'
}

export interface Student {
  nisn: string;
  name: string;
  className: string;
  status: GraduationStatus;
  major: string;
  averageScore: number;
}

export interface ApiResponse {
  success: boolean;
  data?: Student;
  message?: string;
  aiMessage?: string;
}
