import "./ContractAccord.scss";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import {
  duotoneSea,
  oneDark,
  twilight,
  atomDark,
  moonscript,
  funky,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

const ContractAccord = ({ name, number, total, contract, getExplanation }) => {
  //   const [isClicked, setIsClicked] = useState(false);
  const [explanation, setExplanation] = useState("");
  //   console.log(contract);

  //   const handleGptClick = async () => {
  //     const explanation = await getExplanation(contract);
  //     setExplanation(explanation);
  //   };

  //   const handleGptClick = async () => {
  //     setExplanation(
  //       <BeatLoader
  //         className="gpt__loader"
  //         color={"#fff"}
  //         loading={true}
  //         size={10}
  //       />
  //     );
  //     setTimeout(() => {
  //       setExplanation("Almost there...");
  //       setTimeout(() => {
  //         setExplanation("Still thinking...");
  //         setTimeout(() => {
  //           setExplanation("Sorry, GPT-4 is slow...");
  //         }, 10000);
  //       }, 10000);
  //     }, 10000);
  //     const gptExplanation = await getExplanation(contract);

  //     setExplanation(gptExplanation);
  //   };

  //   const handleGptClick = async () => {
  //     setExplanation(
  //       <BeatLoader
  //         className="gpt__loader"
  //         color={"#fff"}
  //         loading={true}
  //         size={10}
  //       />
  //     );
  //     setTimeout(() => {
  //       setExplanation("Almost there...");
  //       setTimeout(() => {
  //         setExplanation("Still thinking...");
  //         setTimeout(() => {
  //           setExplanation("Sorry, GPT-4 is slow...");
  //         }, 10000);
  //       }, 10000);
  //     }, 10000);
  //     const gptExplanation = await getExplanation(contract);
  //     setTimeout(() => {
  //       setExplanation(gptExplanation);
  //     }, 2000);
  //   };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateLoadingState = async (isResponseReceived) => {
    if (isResponseReceived.current) return;

    await sleep(7500);
    if (isResponseReceived.current) return;
    setExplanation("Still thinking...");

    await sleep(10000);
    if (isResponseReceived.current) return;
    setExplanation("Almost got it...");

    await sleep(10000);
    if (isResponseReceived.current) return;
    setExplanation("We actually use GPT-4 unlike some, its just slow...");

    await sleep(10000);
    if (isResponseReceived.current) return;
    setExplanation("Should we just give up?");

    await sleep(10000);
    if (isResponseReceived.current) return;
    setExplanation("Ok fine, we'll give up...");

    await sleep(10000);
    if (isResponseReceived.current) return;
    setExplanation("Ok, something is definitely wrong... Try again later.");
  };

  const handleGptClick = async () => {
    setExplanation(
      <BeatLoader
        className="gpt__loader"
        color={"#fff"}
        loading={true}
        size={10}
      />
    );

    const isResponseReceived = { current: false };

    const gptExplanationPromise = getExplanation(contract);
    const loadingStatePromise = updateLoadingState(isResponseReceived);

    const gptExplanation = await gptExplanationPromise;
    isResponseReceived.current = true;
    setExplanation(gptExplanation);

    await loadingStatePromise;
  };

  return (
    <section className="accord">
      <Accordion
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "1px solid grey",
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className="accord">
            <Typography fontSize="2rem" fontFamily="lalo">
              {name}
            </Typography>
            <Typography fontSize="1.6rem" fontFamily="lalo" color="grey">
              Contract {number} of {total}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="gpt">
            <button onClick={handleGptClick} className="gpt__button">
              Click To Explain
            </button>

            <Typography fontFamily="lalo" fontSize="1.6rem">
              {explanation}
            </Typography>
          </div>

          <SyntaxHighlighter showLineNumbers language="solidity" style={funky}>
            {contract}
          </SyntaxHighlighter>
        </AccordionDetails>
      </Accordion>
    </section>
  );
};

export default ContractAccord;
