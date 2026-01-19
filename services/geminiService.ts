
import { GoogleGenAI } from "@google/genai";
import { GraduationStatus, Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generatePersonalizedMessage = async (student: Student): Promise<string> => {
  try {
    const isPassed = student.status === GraduationStatus.LULUS;
    
    const prompt = `
      Anda adalah AI asisten dari SMAN 1 TOJO. 
      Berikan pesan singkat (maksimal 3 kalimat) yang sangat menginspirasi, puitis, dan modern untuk siswa bernama ${student.name} dari kelas ${student.className}.
      Status kelulusan: ${student.status}.
      
      Jika Lulus: Berikan ucapan selamat yang hangat atas kelulusan tahun 2026 dan dorongan untuk masa depan.
      Jika Tertunda: Berikan pesan motivasi agar tidak menyerah dan segera menghubungi pihak sekolah untuk administrasi.
      
      Gunakan gaya bahasa anak muda tahun 2026 yang sopan tapi keren.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "Selamat menempuh babak baru dalam hidupmu!";
  } catch (error) {
    console.error("AI Error:", error);
    return student.status === GraduationStatus.LULUS 
      ? "Selamat atas kelulusanmu! Masa depan cerah menantimu di luar sana." 
      : "Silakan hubungi bagian administrasi sekolah untuk informasi lebih lanjut.";
  }
};
