import { useRef, useState } from "react";
import styles from "./App.module.css";
import birdImages from "./birdimages";
import birdLogo from "./assets/birdvote.png";

function App() {
    const [votingResults, setVotingResults] = useState<number[]>([]);
    const resultAreaRef = useRef<HTMLDivElement>(null);

    const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);

    const progress_message = `${Math.floor(
        (100 * votingResults.length) / birdImages.length
    )}% Complete`;

    function addVote(index: number) {
        if (!votingResults.includes(index)) {
            setVotingResults([...votingResults, index]);
            setVoteSubmitted(false);
        }
        if (resultAreaRef.current) {
            resultAreaRef.current.scrollLeft =
                resultAreaRef.current.scrollWidth;
        }
    }

    function removeVote(index: number) {
        setVotingResults((previousVotingResults) => {
            const newVotingResults = [...previousVotingResults];
            newVotingResults.splice(index, 1);
            return newVotingResults;
        });
    }

    function moveLeft(index: number) {
        setVotingResults((prevVotingResults) =>
            swapAtIndex(prevVotingResults, index, -1)
        );
        setVoteSubmitted(false);
    }

    function moveRight(index: number) {
        setVotingResults((prevVotingResults) =>
            swapAtIndex(prevVotingResults, index, 1)
        );
        setVoteSubmitted(false);
    }

    function swapAtIndex<T>(arr: T[], index: number, offset: number) {
        // Swap with offseted index
        const otherIndex = index + offset;

        if (otherIndex < 0 || otherIndex >= arr.length) {
            return arr;
        }

        const selectedValue = arr[index];
        const otherValue = arr[otherIndex];

        const newArr = [...arr];
        newArr[index] = otherValue;
        newArr[otherIndex] = selectedValue;
        return newArr;
    }

    function submitVote() {
        setVoteSubmitted(true);
        const ballot = votingResults
            .map((index) => (index + 1).toString())
            .join(" ");
        const ballotText = `||BALLOT: ${ballot}||`;
        // console.log("yo mama");
        navigator.clipboard.writeText(ballotText);
    }

    return (
        <>
            <div>
                <span>
                    <h1 className={styles.header}>
                        RANKED CHOICE BIRD VOTING!!!
                    </h1>
                    <span>
                        <img src={birdLogo} className={styles.pageLogo} />
                    </span>
                </span>
            </div>
            <div className={styles.voting_area}>
                {birdImages.map((birdImage, index) => (
                    <img
                        src={birdImage}
                        key={index}
                        draggable={false}
                        onClick={() => addVote(index)}
                        className={
                            `${
                                votingResults.includes(index)
                                    ? styles.selected
                                    : styles.unselected
                            } ` + styles.bird_image
                        }
                    />
                ))}
            </div>
            <div>Your Vote ({progress_message}):</div>
            <div className={styles.result_area} ref={resultAreaRef}>
                {votingResults.map((imageIndex, index) => (
                    <div className={styles.result} key={index}>
                        <button
                            className={styles.remove_button}
                            onClick={() => removeVote(index)}
                        >
                            X
                        </button>
                        <img
                            src={birdImages[imageIndex]}
                            className={styles.bird_image}
                            draggable={false}
                        />
                        <div className={styles.rank}>
                            <button
                                className={styles.move_button}
                                onClick={() => moveLeft(index)}
                            >
                                <span className={styles.horizontal}>⬅️</span>
                                <span className={styles.vertical}>⬆️</span>
                            </button>
                            <p>#{index + 1}</p>
                            <button
                                className={styles.move_button}
                                onClick={() => moveRight(index)}
                            >
                                <span className={styles.horizontal}>➡️</span>
                                <span className={styles.vertical}>⬇️</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => submitVote()}
                className={styles.submit_button}
            >
                SUBMIT MY VOTE
            </button>
            {voteSubmitted && (
                <p>Vote copied to clipboard, please send on discord!</p>
            )}
        </>
    );
}

export default App;
