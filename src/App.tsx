import { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import { queryGPT } from './composables/useAI';
import { EventBus } from './game/EventBus';

function App()
{
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const [scene, setScene] = useState<Phaser.Scene | null>(null);

    const [levelDone, setLevelDone] = useState(false);

    useEffect(() => {
        const handler = () => setLevelDone(true);
        EventBus.on("level-done", handler);
    
        return () => {
            EventBus.off("level-done", handler); // cleanup
        };
    }, []);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        
    }
    
    const getResponseFromLLM = async (prompt: string) => {
        let answer: string = await queryGPT(prompt);
        setResponse(answer);
    }

    const advanceLevel = () => {
        EventBus.emit("goto-next-level")
        setLevelDone(false);
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button onClick={advanceLevel} disabled={!levelDone}>Proceed to next level</button>
                </div>
                <div>
                    <p>GPT Integration</p>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask me anything..."
                    />
                    <button onClick={() => getResponseFromLLM(message)}>Ask</button>
                    <p>Response: {response}</p>
                </div>
            </div>
        </div>
    )
}

export default App
