import { z } from 'zod';

// Validation schema for form submission
export const AccessLogSchema = z.object({
  unitNumber: z.number({
    message: "유닛 넘버는 숫자만 입력 가능합니다"
  })
  .int({ message: "유닛 넘버는 정수여야 합니다" })
  .min(1, { message: "유닛 넘버는 1 이상이어야 합니다" })
  .max(9999, { message: "유닛 넘버는 9999 이하여야 합니다" }),

  firstName: z.string({
    message: "이름을 입력해 주세요"
  })
  .trim()
  .min(1, { message: "이름을 입력해 주세요" })
  .max(50, { message: "이름은 50자 이내로 입력해 주세요" })
});

export type AccessLogInput = z.infer<typeof AccessLogSchema>;
