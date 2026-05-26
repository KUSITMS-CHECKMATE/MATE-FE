import { defineConfig } from "orval";

const apiBase = process.env.VITE_API_BASE_URL;
const swaggerUrl = `${apiBase}/api-docs`;

const makeInput = (tags: string[]) => ({
  target: swaggerUrl,
  unsafeDisableValidation: true,
  filters: { tags },
});

const makeOutput = (filename: string) => ({
  target: `src/shared/api/generated/${filename}.ts`,
  client: "react-query" as const,
  override: {
    mutator: {
      path: "src/shared/api/mutator.ts",
      name: "kyMutator",
    },
    query: {
      useQuery: true,
      useMutation: true,
    },
  },
});

export default defineConfig({
  test: {
    input: makeInput(["[TEST] 테스트 API"]),
    output: makeOutput("test"),
  },
  question: {
    input: makeInput(["[QUESTION] 질문 API"]),
    output: makeOutput("question"),
  },
  answer: {
    input: makeInput(["[ANSWER] 응답 API"]),
    output: makeOutput("answer"),
  },
  auth: {
    input: makeInput(["[AUTH] 인증 API"]),
    output: makeOutput("auth"),
  },
  file: {
    input: makeInput(["[FILE] 파일 API"]),
    output: makeOutput("file"),
  },
  users: {
    input: makeInput(["[USERS] 사용자 API"]),
    output: makeOutput("users"),
  },
  testDraft: {
    input: makeInput(["[TEST DRAFT] 테스트 초안 API"]),
    output: makeOutput("testDraft"),
  },
  report: {
    input: makeInput(["[REPORT] 리포트 API"]),
    output: makeOutput("report"),
  },
  payment: {
    input: makeInput(["[MOCK PAYMENT] 결제 API"]),
    output: makeOutput("payment"),
  },
});
