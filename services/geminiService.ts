
import { GoogleGenAI } from "@google/genai";
import { DatasetPreview, TuningConfig, GenerationResult } from "../types";

// Helper to initialize the client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Uses Gemini to generate a robust Python script and simulate the tuning process output.
 */
export const generateTrainingScript = async (
  dataset: DatasetPreview,
  config: TuningConfig
): Promise<GenerationResult> => {
  // Input Validation
  if (!dataset || dataset.columns.length === 0) {
    throw new Error("Dataset is empty or invalid.");
  }
  if (!config.targetColumn || !dataset.columns.includes(config.targetColumn)) {
    throw new Error(`Target column "${config.targetColumn}" not found in dataset.`);
  }

  try {
    const ai = getClient();
    
    // Construct a prompt that gives context about the data
    const columnsStr = dataset.columns.join(", ");
    const sampleDataStr = JSON.stringify(dataset.sampleData.slice(0, 3));

    const prompt = `
      Act as a ML Engineer.
      
      TASK:
      1. Write a production-ready Python script for Hyperparameter Tuning.
      2. SIMULATE execution and generate logs.

      CONTEXT:
      - Model: ${config.modelType}
      - Target: "${config.targetColumn}"
      - Columns: [${columnsStr}]
      - Sample: ${sampleDataStr}
      - Method: ${config.tuningMethod}
      - Hyperparams: ${config.hyperparams}
      - CV Folds: ${config.cvFolds}
      - Trials: ${config.nTrials}

      REQUIREMENTS:
      - Load 'dataset.csv' via pandas.
      - PREPROCESSING: Handle missing values (SimpleImputer) & encode categoricals (OneHot/LabelEncoder).
      
      - MODEL SELECTION & PARAMETERS (Strict adherence):
          * GradientBoosting: Use sklearn.ensemble.GradientBoostingClassifier/Regressor. Prioritize 'n_estimators', 'learning_rate', 'max_depth', 'subsample', 'max_features'.
          * DecisionTree: Use sklearn.tree.DecisionTreeClassifier/Regressor. Prioritize 'max_depth', 'min_samples_split', 'min_samples_leaf', 'criterion', 'ccp_alpha'.
          * LinearRegression: Use sklearn.linear_model.LinearRegression. Prioritize 'fit_intercept', 'positive'.
          * AdaBoost: sklearn.ensemble.AdaBoostClassifier/Regressor
          * ExtraTrees: sklearn.ensemble.ExtraTreesClassifier/Regressor
          * XGBoost: xgboost.XGBClassifier/Regressor
          * LightGBM: lightgbm.LGBMClassifier/Regressor
          * CatBoost: catboost.CatBoostClassifier/Regressor
          * RandomForest: sklearn.ensemble.RandomForestClassifier/Regressor
          * SVM: sklearn.svm.SVC/SVR
          * KNN: sklearn.neighbors.KNeighborsClassifier/Regressor
          * LogisticRegression: sklearn.linear_model.LogisticRegression
      
      - TUNING ENGINE:
          * 'Grid Search' -> sklearn.model_selection.GridSearchCV
          * 'Random Search' -> sklearn.model_selection.RandomizedSearchCV
          * 'Bayesian (Optuna)' -> optuna with TPESampler
          * 'Hyperband' -> optuna with HyperbandPruner

      - HYPERPARAM VALIDATION:
          * Check provided 'Hyperparams'.
          * IF MALFORMED/INVALID for ${config.modelType}:
            - Script must start with "# Error: Invalid Hyperparameter Configuration".
            - Logs: ["Error: Hyperparameter validation failed.", "<Specific Reason>"]
            - STOP generation.
          * IF VALID: Use search space.

      - EXECUTION SPECS:
          * ${config.cvFolds}-fold CV.
          * ${config.nTrials} trials.
          * Save to 'model.pkl'.
      - OUTPUT: Raw python code. NO comments/docstrings.

      OUTPUT FORMAT (JSON ONLY):
      {
        "script": "string (raw python code, minimal comments)",
        "logs": ["string", ... (Max 3 concise lines: Preprocessing -> Tuning -> Result)],
        "best_params": { "param_name": value, ... },
        "best_score": number (0.0 to 1.0),
        "metric": "string (e.g. Accuracy, RMSE)"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "{}";
    
    // CLEANUP: Remove potential Markdown formatting (```json ... ```) which causes JSON.parse to fail
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let data;
    try {
        data = JSON.parse(text);
    } catch (parseError) {
        console.error("JSON Parse failed. Raw text:", text);
        // Throw a specific error so the catch block handles it nicely
        throw new Error(`AI Response Malformed: ${parseError instanceof Error ? parseError.message : 'Invalid JSON'}`);
    }

    // Validate the response structure
    if (!data.script || !Array.isArray(data.logs)) {
        throw new Error("Invalid AI response structure: Missing script or logs fields.");
    }

    return {
      script: data.script,
      logs: data.logs,
      bestParams: data.best_params || {},
      bestScore: data.best_score || 0.0,
      metric: data.metric || "Score"
    };

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    
    // Handle specific API errors
    let userMessage = "Optimization failed due to an unexpected error.";
    let detailedError = error.message || "Unknown error";

    if (detailedError.includes("429")) {
        userMessage = "System is busy (Rate Limit Exceeded). Please wait a moment and try again.";
    } else if (detailedError.includes("403") || detailedError.includes("401")) {
        userMessage = "Authorization failed. Please check your API key or billing status.";
    } else if (detailedError.includes("503") || detailedError.includes("500")) {
        userMessage = "AI Service is temporarily unavailable. Please retry.";
    } else if (detailedError.includes("SAFETY") || detailedError.includes("BLOCKED")) {
        userMessage = "The request was blocked by safety filters. Please try a different dataset or parameters.";
    } else if (detailedError.includes("Malformed") || detailedError.includes("JSON")) {
        userMessage = "AI generated invalid output format. Please retry the operation.";
    }

    // Return an error state that the dashboard can display
    return {
        script: `# ERROR: ${userMessage}\n# Details: ${detailedError}\n# timestamp: ${new Date().toISOString()}`,
        logs: [`Error: ${userMessage}`],
        bestParams: {},
        bestScore: 0,
        metric: "Error"
    };
  }
};

/**
 * Generates a Python script for SHAP analysis.
 */
export const generateShapScript = async (
    dataset: DatasetPreview,
    config: TuningConfig
): Promise<string> => {
    try {
        const ai = getClient();
        const columnsStr = dataset.columns.join(", ");
        
        const prompt = `
            Act as a ML Engineer.
            Write a Python script to visualize model explainability using SHAP.
            
            CONTEXT:
            - Dataset columns: [${columnsStr}]
            - Target: "${config.targetColumn}"
            - Model Type: ${config.modelType}
            - Files: 'model.pkl', 'dataset.csv'

            REQUIREMENTS:
            1. Comment: "# Requires: pip install shap matplotlib"
            2. Import pandas, shap, joblib, matplotlib.pyplot.
            3. Load 'model.pkl' and 'dataset.csv'.
            4. Preprocess data EXACTLY matching model input.
            5. Select explainer:
               - Tree-based: shap.TreeExplainer
               - Linear: shap.LinearExplainer
               - Others: shap.KernelExplainer
            6. Calculate SHAP values (100 rows).
            7. Generate shap.summary_plot and shap.dependence_plot.
            8. Output ONLY raw Python code.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let text = response.text?.trim() || "";
        // Clean markdown if present
        text = text.replace(/```python/g, '').replace(/```/g, '').trim();

        return text || "# Failed to generate SHAP script.";
    } catch (e) {
        console.error("SHAP Generation Error:", e);
        return "# Error generating SHAP script. Please try again.";
    }
}

/**
 * Analyzes the dataset to suggest a model type and target variable.
 */
export const analyzeDataset = async (dataset: DatasetPreview): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `
          Analyze dataset schema:
          Columns: ${dataset.columns.join(', ')}
          Sample: ${JSON.stringify(dataset.sampleData.slice(0, 2))}
          
          Suggest 1 recommended model type and explain why in 1 short sentence.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text?.trim() || "Analysis unavailable.";
    } catch (e) {
        console.warn("Analysis failed:", e);
        return "Ready to configure parameters.";
    }
};
