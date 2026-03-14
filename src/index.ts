import ollama from "ollama";

import tools, { type ToolName } from "./tools/tools.ts";

const MODEL = "gemma3:12b";

const systemInstruction = `
당신은 도구 호출(Tool Calling) 전용 어시스턴트입니다.
사용자의 요청을 분석하여 지정된 도구를 호출하기 위한 JSON 객체만을 출력해 주세요.

규칙:
- 오직 JSON만 출력: 인사말, 설명, 마크다운 코드 블록(\`\`\`json) 등을 절대 포함하지 마세요.
- 형식 준수: 반드시 유효한 JSON 형식이어야 하며, 누락된 필드가 없어야 합니다.
- 도구 미사용 시: 만약 호출할 도구가 없다면 {"call": "none"}을 출력하세요.

도구 목록:
${tools.openWeb.instruction}
`;

const messages = [{ role: "system", content: systemInstruction }];

async function run() {
  messages.push({ role: "user", content: "네이버 사이트를 열어주세요." });

  const response = await ollama.chat({
    model: MODEL,
    messages,
  });

  const content = response.message.content;
  messages.push({ role: "assistant", content });

  try {
    const { action, params } = JSON.parse(content);

    const { success, error } = await tools[action as ToolName].tool(params);
    if (success) {
      console.log(`[시스템] 함수: ${action}, 결과: 성공`);
    } else {
      console.log(`[시스템] 함수: ${action}, 결과: 실패, 에러: ${error}`);
    }
  } catch (e) {
    console.log(`[시스템] 에러 발생: ${e}`);
  }
}

run();
