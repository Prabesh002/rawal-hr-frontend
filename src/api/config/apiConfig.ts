interface AppConfig {
  baseApiUrl: string;
}

let appConfig: AppConfig | null = null;

export const loadAppConfig = async (): Promise<AppConfig> => {
  if (appConfig) {
    return appConfig;
  }

  try {
    const response = await fetch('/EnvironmentConfig.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch EnvironmentConfig.json: ${response.statusText}`);
    }
    const config = await response.json();

    appConfig = config as AppConfig;

    return appConfig;
  } catch (error) {
    console.error("Error loading application configuration:", error);
    throw error;
  }
};

export const getAppConfig = (): AppConfig => {
  if (!appConfig) {
    throw new Error(
      "Application configuration has not been loaded. Call loadAppConfig first."
    );
  }

  return appConfig;
};