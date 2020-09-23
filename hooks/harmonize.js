const constructors = {
    "tr.dative"(input) {
        return (
          input.match(/[aıou]$/i) ? "ya"
        : input.match(/[eiöü]$/i) ? "ye"
        : input.match(/[aıou][bcçdfgğhjklmnpqrsştvwxyz]+$/i) ? "a"
        : input.match(/[eiöü][bcçdfgğhjklmnpqrsştvwxyz]+$/i) ? "e"
        : ""
        );
    }
}

export default function harmonize(constructor, input) {
    return constructors[constructor](input);
}