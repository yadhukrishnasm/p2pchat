import gemini from './geminiInt.js';

async function nlp(text) {
    const keywords = ['Crazy', 'Hurting yourself', 'Paranoid', 'Dangerous', 'Ill', 'Obsessed', 'Deformed', 'Indecisive', 'Perfectly normal', 'Disturbed', 'Disabled', 'Schizophrenia', 'Scary', 'Isolated', 'Psycho', 'Dumb', 'Loony', 'Demented', 'Freak', 'Embarrassed', 'Brain dead', 'Demanding', 'Stress', 'Screw loose', 'Depressed', 'Insane', 'Unpredictable', 'Pain', 'Suffering', 'Discomfort', 'Suicide', 'Overdose', 'Self-harm', 'End it all', 'Kill yourself', 'Take your life', 'Suicide attempt', 'Suicidal thoughts', 'Suicide prevention', 'Suicide hotline', 'Hopeless', 'Helpless', 'Worthless', 'Alone', 'Abandoned', 'Trapped', 'Despair', 'Dark thoughts', 'No way out', 'Life is meaningless', 'End of the road', 'Lost cause', 'Final solution', 'Last resort', 'Pointless', 'Irreversible', 'Fatal', 'Death wish', 'Dying inside', 'No escape', 'Vanishing point', 'Beyond repair', 'Beyond help', 'No future', 'Dead end', 'Life is over', 'Nothing left', 'No reason to live', 'Give up', 'Fade away', 'Perish', 'Demise', 'Fatality', 'Mortal', 'Grave', 'Tomb', 'Coffin', 'Euthanasia', 'Terminal', 'Lethal', 'Extinguish', 'Oblivion', 'Departure', 'Passing', 'Farewell', 'Rest in peace'];

    const textLower = text.toLowerCase();

    // Check for keywords
    const foundKeyword = keywords.some(keyword => textLower.includes(keyword.toLowerCase()));

    if (foundKeyword) {
        try {
            const result = await gemini(text);
            console.log('Keywords found; firing request');
            return result;
        } catch (error) {
            console.error('Error in gemini function:', error);
            return "Error occurred while processing the request";
        }
    } else {
        console.log('No keywords found');
        return "";
    }
}

export default nlp;
