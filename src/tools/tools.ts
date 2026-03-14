import openWeb from "./openWeb.ts";

export type ToolName = "openWeb";

type Tools = {
  [key in ToolName]: {
    instruction: string;
    tool: (args: any) => any;
  }
}

const tools: Tools = {
  openWeb
};

export default tools;