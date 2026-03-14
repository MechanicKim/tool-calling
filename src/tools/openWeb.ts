import open from "open";

const instruction = `
### openWeb
웹 페이지를 열어줍니다.

[출력 형식]
{
  action: "openWeb",
  params: {
    siteName: "gemini" | "naver"
  }
}
`;

const siteNameToURL = {
  gemini: "https://gemini.google.com/app?hl=ko",
  naver: "https://www.naver.com/",
};

type SiteName = "gemini" | "naver";

interface OpenWebParams {
  siteName: SiteName;
}

async function openWeb({ siteName }: OpenWebParams) {
  try {
    const url = siteNameToURL[siteName];
    await open(url);
    return null;
  } catch (error) {
    return error;
  }
}

export default {
  instruction,
  tool: openWeb,
};
