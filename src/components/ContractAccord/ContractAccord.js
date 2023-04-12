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
  const [explanation, setExplanation] = useState("");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateLoadingState = async (isResponseReceived) => {
    if (isResponseReceived.current) return;

    await sleep(15000);
    if (isResponseReceived.current) return;
    setExplanation("Still thinking...");

    await sleep(20000);
    if (isResponseReceived.current) return;
    setExplanation("Almost got it...");

    await sleep(25000);
    if (isResponseReceived.current) return;
    setExplanation("We actually use GPT-4 unlike some, its just slow...");

    await sleep(30000);
    if (isResponseReceived.current) return;
    setExplanation("Really, really slow...");

    await sleep(35000);
    if (isResponseReceived.current) return;
    setExplanation("Still working on it...");

    await sleep(60000);
    if (isResponseReceived.current) return;
    setExplanation("Ok, something is either wrong, or GPT-4 is down...");
  };

  const handleGptClick = async () => {
    setExplanation(
      // <BeatLoader
      //   className="gpt__loader"
      //   color={"#fff"}
      //   loading={true}
      //   size={10}
      // />
      "Thinking..."
    );

    // FIXME:
    // Added ability to chose a (basic) explination button.
    // Its currently set to the normal one so add a new button that has a paramater of contract, 5.
    // 5 is the prompt index of the basic prompt.

    const isResponseReceived = { current: false };

    const gptExplanationPromise = getExplanation(contract);
    const loadingStatePromise = updateLoadingState(isResponseReceived);

    const gptExplanation = await gptExplanationPromise;
    isResponseReceived.current = true;
    setExplanation(gptExplanation);

    await loadingStatePromise;
  };

  const handleGptSimpleClick = async () => {
    setExplanation(
      // <BeatLoader
      //   className="gpt__loader"
      //   color={"#fff"}
      //   loading={true}
      //   size={10}
      // />
      "Thinking..."
    );

    const isResponseReceived = { current: false };

    const gptExplanationPromise = getExplanation(contract, 5);
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
          color: "white",
          border: "1px solid rgb(55 55 55)",
          background: "rgba(0, 0, 0, 0.25)",
          "backdrop-filter": "blur(0.75rem)",
          "-webkit-backdrop-filter": "blur(0.75rem)",
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
              Advanced 0xExplain
            </button>
            <button onClick={handleGptSimpleClick} className="gpt__button">
              Simple 0xExplain
            </button>

            <Typography fontFamily="lalo" fontSize="1.6rem">
              {/* {explanation} */}
              <pre className="gpt__response">
                <code
                  className="gpt__code"
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              </pre>
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
