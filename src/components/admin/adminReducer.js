import { initialAdminSessions, initialBlockedTimes } from "../../data/siteData.js";

export const initialAdminState = {
  sessions: initialAdminSessions,
  blocked: initialBlockedTimes,
  selectedDate: "2026-06-08",
  statusFilter: "Visos būsenos",
  search: "",
  toast: "",
  blockModal: null,
};

export function adminReducer(state, action) {
  switch (action.type) {
    case "SET_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_STATUS":
      return { ...state, statusFilter: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "TOAST":
      return { ...state, toast: action.payload };
    case "CLEAR_TOAST":
      return { ...state, toast: "" };
    case "OPEN_BLOCK_MODAL":
      return { ...state, blockModal: action.payload };
    case "CLOSE_BLOCK_MODAL":
      return { ...state, blockModal: null };
    case "ADD_BLOCK": {
      const exists = state.blocked.some(
        (item) => item.date === action.payload.date && item.time === action.payload.time
      );

      if (exists) {
        return { ...state, toast: "Šis laikas jau užimtas.", blockModal: null };
      }

      return {
        ...state,
        blocked: [...state.blocked, { id: Date.now(), ...action.payload }],
        blockModal: null,
        toast: "Laikas pažymėtas kaip užimtas.",
      };
    }
    case "REMOVE_BLOCK":
      return {
        ...state,
        blocked: state.blocked.filter((item) => item.id !== action.payload),
        toast: "Laikas atlaisvintas.",
      };
    case "UPDATE_SESSION_STATUS":
      return {
        ...state,
        sessions: state.sessions.map((item) =>
          item.id === action.payload.id ? { ...item, status: action.payload.status } : item
        ),
      };
    case "MOVE_SESSION": {
      const { id, date, time } = action.payload;
      const conflict = state.sessions.some(
        (item) => item.id !== id && item.date === date && item.time === time && item.status !== "Atšaukta"
      );
      const isBlocked = state.blocked.some((item) => item.date === date && item.time === time);

      if (conflict || isBlocked) {
        return { ...state, toast: "Šis laikas užimtas." };
      }

      return {
        ...state,
        sessions: state.sessions.map((item) =>
          item.id === id ? { ...item, date, time } : item
        ),
        toast: "Registracija perkelta.",
      };
    }
    default:
      return state;
  }
}
