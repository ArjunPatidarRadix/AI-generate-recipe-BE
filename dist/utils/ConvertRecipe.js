// // import * as torch from "torchjs";
// // import { AutoTokenizer, AutoModelForCausalLM } from "@xenova/transformers";
// // export async function runQuickSortPrompt() {
// //   const modelName = "Qwen/Qwen2.5-Coder-32B-Instruct";
// //   // Load the tokenizer and model
// //   console.log("Loading tokenizer and model...");
// //   const tokenizer = await AutoTokenizer.from_pretrained(modelName);
// //   const model = await AutoModelForCausalLM.from_pretrained(modelName);
// //   // Prompt and system message
// //   const prompt =
// //     "what is the detailed recipe for a pizza with olives, tomatoes, and cheese?";
// //   const messages = [
// //     {
// //       role: "system",
// //       content:
// //         "you are elite chife who knows every single recipe and can answer it with easy to follow detailed steps.",
// //     },
// //     { role: "user", content: prompt },
// //   ];
// //   // Construct the input for the model
// //   console.log("Preparing input...");
// //   const inputText = tokenizer.apply_chat_template(messages, {
// //     tokenize: false,
// //     add_generation_prompt: true,
// //   });
// //   // Tokenize input
// //   const inputs = await tokenizer(inputText, { returnTensors: true });
// //   // Generate response
// //   console.log("Generating response...");
// //   const outputs = await model.generate(inputs.input_ids, {
// //     maxNewTokens: 512,
// //   });
// //   console.log("Generated outputs:", outputs);
// //   // Decode the output
// //   const generatedText = tokenizer.decode(outputs[0], {
// //     skip_special_tokens: true,
// //   });
// //   console.log("Generated Response:", generatedText);
// // }
// // Run the function
// import {
//   pipeline,
//   AutoModelForCausalLM,
//   AutoTokenizer,
// } from "@huggingface/transformers";
// import * as torch from "torchjs"; // Install compatible bindings if needed
// const modelName = "Qwen/Qwen2.5-Coder-32B-Instruct";
// // Function to set up and execute the model
// export async function runQuickSortPrompt() {
//   // Load the model and tokenizer
//   const model = await AutoModelForCausalLM.from_pretrained(modelName);
//   const tokenizer = await AutoTokenizer.from_pretrained(modelName);
//   const prompt =
//     "what is the detailed recipe for a pizza with olives, tomatoes, and cheese?";
//   const messages = [
//     {
//       role: "system",
//       content:
//         "you are elite chife who knows every single recipe and can answer it with easy to follow detailed steps.",
//     },
//     { role: "user", content: prompt },
//   ];
//   // Apply chat template
//   const text = tokenizer.apply_chat_template(messages, {
//     tokenize: false,
//     add_generation_prompt: true,
//   });
//   // Tokenize input
//   // const modelInputs = tokenizer(text, { returnTensors: "pt" }).to(model.device);
//   const modelInputs = await tokenizer(tokenizer, { returnTensors: true });
//   // Generate output
//   const generatedIds = await model.generate({
//     ...modelInputs,
//     max_new_tokens: 512,
//   });
//   console.log("Generated outputs:", generatedIds);
//   // Decode the output
//   const generatedText = tokenizer.decode(generatedIds[0], {
//     skip_special_tokens: true,
//   });
//   console.log("Generated Response:", generatedText);
//   // Remove input IDs from the output
//   // const responseIds = generatedIds.map((outputIds, idx) => {
//   //   const inputIds = modelInputs.input_ids[idx];
//   //   return outputIds.slice(inputIds.length);
//   // });
//   // // Decode response
//   // const response = tokenizer.decode(responseIds[0], {
//   //   skip_special_tokens: true,
//   // });
//   // console.log("Generated Response:", response);
// }
// // Run the function
