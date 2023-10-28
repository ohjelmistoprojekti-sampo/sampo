import OpenAI from "openai";

async function getConditionInstructionsForItem(itemDescription: string): Promise<string | null> {
    
    const openai = new OpenAI({
      apiKey: "api-key-here" // replace with api key
    });
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "Myyn käytettyä tuotetta.\n\nTee minulle lista avuksi mikä tekee tuotteesta tiettyyn kuntoluokkaan kuuluvan, käytä luokituksia: uusi, erinomainen, hyvä\ntyydyttävä, huono.\n\nAnna lista muodossa:\n\n[luokitus]:\n- huomioon otettavat asiat\n\nListalla pitää olla kaikki luokitukset.\n\n"
        },
        {
          "role": "user",
          "content": `${itemDescription}`
        },
      ],
      temperature: 1,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content;
}