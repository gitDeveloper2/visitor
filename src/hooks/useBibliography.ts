import {  useEffect, useReducer, useRef } from "react";
import { Reference } from "../types/Bibliography";



export interface BibliographyState {
  inline: Record<string, Reference>;
  background: Record<string, Reference>;
}

type BibliographyAction =
  | { type: "ADD_REFERENCE"; payload: { reference: Reference; inline: boolean } }
  | { type: "EDIT_REFERENCE"; payload: { id: string; reference: Reference } }
  | { type: "DELETE_REFERENCE"; payload: { id: string } };

// export const initialState: BibliographyState = {
//   inline: {},
//   background: {},
// };

const bibliographyReducer = (state: BibliographyState, action: BibliographyAction): BibliographyState => {
 
  switch (action.type) {
    case "ADD_REFERENCE":
      const target = action.payload.inline ? "inline" : "background";
      return {
        ...state,
        [target]: {
          ...state[target],
          [action.payload.reference.id]: action.payload.reference,
        },
      };

      case "EDIT_REFERENCE": {
        const isInline = state.inline[action.payload.id] !== undefined;
        const isBackground = state.background[action.payload.id] !== undefined;
  
        return {
          ...state,
          inline: isInline
            ? {
                ...state.inline,
                [action.payload.id]: action.payload.reference, // Update inline reference
              }
            : state.inline, // Leave inline unchanged if not present
          background: isBackground
            ? {
                ...state.background,
                [action.payload.id]: action.payload.reference, // Update background reference
              }
            : state.background, // Leave background unchanged if not present
        };
      }
  
    case "DELETE_REFERENCE":
      const { [action.payload.id]: _, ...updatedInline } = state.inline;
      const { [action.payload.id]: __, ...updatedBackground } = state.background;
    
      return {
        ...state,
        inline: updatedInline,
        background: updatedBackground,
      };

    default:
      return state;
  }
};

export const useBibliography = (refs:BibliographyState) => {
  const [state, dispatch] = useReducer(bibliographyReducer, refs);
  const stateRef = useRef(state);
  
 
useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const addReference = (reference: Reference, inline: boolean) => {
    
    dispatch({ type: "ADD_REFERENCE", payload: { reference, inline } });
  };

  const editReference = (id: string, reference: Reference) => {
    
    dispatch({ type: "EDIT_REFERENCE", payload: { id, reference } });
  };

  const deleteReference = (id: string) => {
    dispatch({ type: "DELETE_REFERENCE", payload: { id } });
  };

  return { state,stateRef, addReference, editReference, deleteReference };
};
