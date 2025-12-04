
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
      2. SIMULATE execution and generate brief logs.

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
      - PREPROCESSING: Handle missing values (SimpleImputer) & encode categoricals (OneHot/LabelEncoder). Drop high-cardinality IDs.
      
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
      
      - TUNING ENGINE SELECTION:
          * If method is 'Grid Search': Use sklearn.model_selection.GridSearchCV.
          * If method is 'Random Search': Use sklearn.model_selection.RandomizedSearchCV OR optuna.samplers.RandomSampler.
          * If method is 'Bayesian Optimization (Optuna)': Use optuna with TPESampler.
          * If method is 'Hyperband': Use optuna with HyperbandPruner.

      - HYPERPARAMETERS (VALIDATION REQUIRED):
          * You are the validation engine. Check the provided 'Hyperparams' string.
          * IF MALFORMED or INVALID for ${config.modelType} (e.g., 'n_estimators' for LinearRegression, syntax errors):
            - Output script: Start EXACTLY with "# Error: Invalid Hyperparameter Configuration" followed by comments explaining the specific error.
            - Output logs: ["Error: Hyperparameter validation failed.", "<Specific Reason for failure>"]
            - DO NOT generate a working script if validation fails.
          * IF VALID:
            - Parse and use the provided search space.
            - Fallback to sensible defaults ONLY if the string is empty (not if it is invalid).

      - EXECUTION:
          * Use ${config.cvFolds}-fold CV.
          * Run ${config.nTrials} trials.
          * Retrain on full data.
          * Save to 'model.pkl' via joblib.
      - OUTPUT: Return ONLY raw code in 'script'. NO comments/docstrings to save space/time.

      OUTPUT FORMAT (JSON ONLY):
      {
        "script": "string (raw python code, no comments)",
        "logs": ["string", ... (Provide 3-5 concise lines: preprocessing, 1 trial example, and result)],
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

    const text = response.text || "{}";
    let data;
    try {
        data = JSON.parse(text);
    } catch (parseError) {
        console.error("JSON Parse failed:", text);
        throw new Error("Failed to parse AI response. The model output was not valid JSON.");
    }

    // Validate the response structure
    if (!data.script || !Array.isArray(data.logs)) {
        throw new Error("Invalid AI response structure: Missing script or logs.");
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
    let errorMessage = "Optimization failed due to an unexpected error.";
    if (error.message.includes("429")) {
        errorMessage = "Service is busy (Rate Limit). Please wait a moment and try again.";
    } else if (error.message.includes("403")) {
        errorMessage = "Access denied. Please check your API key or billing status.";
    } else if (error.message.includes("SAFETY")) {
        errorMessage = "The request was blocked by safety filters.";
    }

    // Return an error state that the dashboard can display
    return {
        script: `# Error: ${errorMessage}\n# Details: ${error.message}`,
        logs: [`Error: ${errorMessage}`],
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
            Write a Python script to visualize model explainability using SHAP (SHapley Additive exPlanations).
            
            CONTEXT:
            - Dataset columns: [${columnsStr}]
            - Target: "${config.targetColumn}"
            - Model Type: ${config.modelType}
            - Files present: 'model.pkl' (trained model), 'dataset.csv' (data)

            REQUIREMENTS:
            1. Include comment: "# Requires: pip install shap matplotlib"
            2. Import pandas, shap, joblib, matplotlib.pyplot.
            3. Load 'model.pkl' and 'dataset.csv'.
            4. Preprocess the data EXACTLY as a standard pipeline would (drop target, encode categoricals if needed) to match the model input.
            5. Determine the correct SHAP explainer:
               - If Model is Tree-based (RandomForest, XGBoost, LightGBM, CatBoost, DecisionTree, GradientBoosting, ExtraTrees, AdaBoost): Use shap.TreeExplainer.
               - If Model is Linear (LinearRegression, LogisticRegression, SVM linear): Use shap.LinearExplainer.
               - Otherwise (KNN, SVM rbf): Use shap.KernelExplainer (use a small background sample like 50 rows).
            6. Calculate SHAP values for the first 100 rows (or all if <100).
            7. Generate two plots code (but don't show, just print "Plot generated"):
               - shap.summary_plot
               - shap.dependence_plot (for the most important feature)
            8. Output ONLY the raw Python code. No markdown formatting.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text?.trim() || "# Failed to generate SHAP script.";
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
          Analyze this dataset schema briefly:
          Columns: ${dataset.columns.join(', ')}
          Sample Data: ${JSON.stringify(dataset.sampleData.slice(0, 2))}
          
          Suggest 1 recommended model type (e.g., "Random Forest for Classification" or "XGBoost for Regression") and explain why in 1 short sentence.
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
