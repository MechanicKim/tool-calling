import ollama from 'ollama';

import tools, {type ToolName } from "./tools/tools.ts";

const MODEL = "gemma3:12b";

const systemInstruction = `
당신은 도움이 되는 AI 비서입니다. 
사용자의 질문에 답하기 위해 외부 도구가 필요하다면 반드시 아래 JSON 형식으로만 답변하세요.
그 외의 텍스트는 절대 덧붙이지 마세요.

${tools.openWeb.instruction}

만약 도구가 필요 없다면 그냥 자연스럽게 한국어로 답변하세요.
`;

const messages = [
  { role: 'system', content: systemInstruction }
];

async function run() {
  messages.push({ role: 'user', content: "네이버 사이트를 열어주세요." });
  
  const response = await ollama.chat({
    model: MODEL,
    messages,
  });

  const content = response.message.content;
  messages.push({ role: 'assistant', content });

  try {
    const { action, params } = JSON.parse(content.replace("```json", "").replace("```", ""));

    if (action === "openWeb") {
      const error = await tools[action as ToolName].tool(params);
      if (error) {
        console.log(`[시스템] 함수: ${action}, 결과: ${error}`);
      }
      
      // console.log(`[시스템] 함수: ${action}, 결과: ${result}`);
      // messages.push({ role: 'user', content: `함수 호출 결과: ${result}. 이 결과를 바탕으로 친절하게 답해주세요.` });

      // const finalResponse = await ollama.chat({
      //   model: MODEL,
      //   messages,
      // });

      // console.log(`[시스템] 최종 답변: ${finalResponse.message.content}`);
    }
  } catch (e) {
    console.log(`[시스템] 에러 발생: ${e}`);
  }
}

run();