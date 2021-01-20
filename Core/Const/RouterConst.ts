/**
 * Мапа всех роутов приложения
 */
export const ROUTE = {
  AUTHORIZATION: {
    PATH: "signin",
    FULL_PATH: "/signin",
  },
  APP: {
    PATH: "/",
    FULL_PATH: "/",
  },
  NOT_FOUND: {
    PATH: "404",
    FULL_PATH: "/404",
  },
  APPLICATIONS: {
    PATH: "applications",
    FULL_PATH: "/applications",
    ALL: {
      PATH: "all",
      FULL_PATH: "/applications/all",
    },
    // TODO ENUM
    FOR_STATUS: {
      PATH: ":status",
      FULL_PATH: "/applications/:status",
    },
  },
  SURVEY: {
    PATH: "survey",
    FULL_PATH: "/survey",
    PUBLIC: {
      PATH: ":id",
      FULL_PATH: "/survey/:id",
    },
    PRIVATE: {
      PATH: ":id",
      FULL_PATH: "/survey/preview/:id",
    },
  },
};
