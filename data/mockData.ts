
import { GraduationStatus, Student } from '../types';

export const MOCK_STUDENTS: Student[] = [
  {
    nisn: "0012345678",
    name: "Aditya Pratama",
    className: "XII-IPA-1",
    status: GraduationStatus.LULUS,
    major: "MIPA",
    averageScore: 92.5
  },
  {
    nisn: "0087654321",
    name: "Siti Rahmawati",
    className: "XII-IPS-2",
    status: GraduationStatus.LULUS,
    major: "IPS",
    averageScore: 88.0
  },
  {
    nisn: "0011223344",
    name: "Budi Santoso",
    className: "XII-IPA-3",
    status: GraduationStatus.TERTUNDA,
    major: "MIPA",
    averageScore: 75.0
  }
];

export const findStudentByNISN = (nisn: string): Student | undefined => {
  return MOCK_STUDENTS.find(s => s.nisn === nisn);
};
