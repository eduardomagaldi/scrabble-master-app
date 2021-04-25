import React, { useEffect, useState } from 'react';

import dataService from '../../services/data';

function Definition({ show, word }) {
  const [definition, setDefinition] = useState(null);

  useEffect(() => {
    (async function () {
      const result = await dataService.getDefinition(word);

      const def = result &&
        result[0] &&
        result[0].meanings &&
        result[0].meanings[0] &&
        result[0].meanings[0].definitions &&
        result[0].meanings[0].definitions[0] &&
        result[0].meanings[0].definitions[0].definition ? result[0].meanings[0].definitions[0].definition : result.title;

      setDefinition(def);
    }());
  }, [word]);

  if (show) {
    if (definition &&
      show) {
      return (
        <span>{definition}</span>
      );
    } else {
      return 'Loading...';
    }
  } else {
    return null;
  }
}

export default Definition;