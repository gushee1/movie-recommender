import { useRef, useState, useEffect } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';
import OpenAI from 'openai';
import { EventBus } from './game/EventBus';

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

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

    // TODO: move this into a module
    const queryGPT = async () => {
        try {
            const result = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }],
            });
            setResponse(result.choices[0].message.content ?? "");
        } catch (err: any) {
            console.error("OpenAI API error:", err);
            if (err.response) {
                setResponse(`Error ${err.response.status}: ${JSON.stringify(err.response.data)}`);
            } else {
                setResponse(err.message ?? "Unknown error");
            }
        }
    }

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        
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
                    <button onClick={queryGPT}>Ask</button>
                    <p>Response: {response}</p>
                </div>
            </div>
        </div>
    )
}

export default App
