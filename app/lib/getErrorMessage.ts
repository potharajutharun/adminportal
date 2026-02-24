type ErrorWithMessage = {
  message?: unknown;
};

type ErrorWithResponseMessage = {
  response?: {
    data?: {
      message?: unknown;
    };
  };
};

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const responseMessage = (error as ErrorWithResponseMessage).response?.data
    ?.message;
  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  const message = (error as ErrorWithMessage).message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
};
