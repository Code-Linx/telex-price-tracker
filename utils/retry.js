class RetryError extends Error {
  constructor(message, attempts, lastError) {
    super(message);
    this.name = "RetryError";
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

const retry = async (operation, options = {}) => {
  const {
    maxAttempts = 500,
    delay = 2000,
    backoffFactor = 2,
    shouldRetry = (error) => true,
  } = options;

  let lastError = null;
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts || !shouldRetry(error)) {
        throw new RetryError("Max retry attempts reached", attempt, lastError);
      }

      const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
      console.log(`Retrying in ${waitTime}ms... (Attempt ${attempt + 1})`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      attempt++;
    }
  }
};

module.exports = {
  RetryError,
  retry,
};
