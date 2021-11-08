const log = console.table;
const { keys, values, entries } = Object;
const length = (x) => x.length;
const anyLang = (x) =>
  x.name.flatMap(() => values(x.stack).flatMap((x) => x?.langs ?? []));
const langsFromStack = (stack) => (x) =>
  x.name.flatMap(() => x.stack[stack]?.langs ?? []);
const uniqueSortByCount = (x) =>
  entries(
    groupBy(
      x,
      (x) => x,
      (x) => x.length
    )
  )
    .sort(([k, v], [k2, v2]) => v2 - v)
    .map(([k, v]) => k);
function main(params) {
  const { projects } = data();
  const names = projects.map((x) => x.name);
  const allLangs = uniqueSortByCount(projects.flatMap(anyLang));
  const langsByProject = entries(
    groupBy(
      projects,
      (x) => keys(x.stack),
      (projectsInStack, stack) => {
        const projectCountForStackByLang = groupBy(
          projectsInStack,
          langsFromStack(stack),
          length
        );
        return {
          length: length(projectsInStack.flatMap((x) => x.name)),
          data: allLangs.map((lang) => projectCountForStackByLang[lang] ?? 0),
        };
      }
    )
  ).map(([k, v]) => ({
    name: k,
    data: v.data,
    y: v.length,
  }));

  [
    "frontend langs",
    groupBy(projects, (x) => x.stack.frontend?.langs ?? "BACKEND_ONLY", length),

    "backend langs",
    groupBy(projects, (x) => x.stack.backend?.langs ?? "FRONTEND_ONLY", length),
    "projects by stack",
    entries(groupBy(projects, (x) => keys(x.stack), length)).map((x) => ({
      name: x[0],
      y: x[1],
    })),
    "Langs By Project",
    langsByProject,
    "",
    groupBy(projects, anyLang, length),
  ]
    // .map(values)
    // .map((x) => x.join())
    .map((x) => log(x));
}

const groupBy = (x, f, fval) =>
  entr(
    x.reduce((a, b) => {
      const key = f(b);
      (Array.isArray(key) ? key : [key]).forEach((key) =>
        (a[key] ||= []).push(b)
      );
      return a;
    }, {}),
    ([k, v]) => [k, fval ? fval(v, k) : v]
  );
const entr = (x, y) => Object.fromEntries(Object.entries(x).map(y));

function data() {
  return {
    companies: [
      {
        name: "VTargete",
        date: { from: "2019-01-01" },
        position: ["Lead Frontend Engineer"],
      },
      {
        name: "BaltInfoCom",
        date: { from: "2018-09-01", to: "2019-04-01" },
        position: ["Software Engineer"],
      },
      {
        name: "Homework",
        date: { from: "2017-08-01", to: "2018-09-01" },
        position: ["Software Engineer"],
      },
    ],
    projects: [
      {
        name: ["vTargete.ru"],
        company: ["VTargete"],
        types: ["Ads management tool"],
        stack: {
          frontend: {
            langs: ["Typescript", "tsx"],
            tools: ["vue-cli", "webpack", "Lerna", "Storybook"],
            libs: ["Vue", "AgGrid", "element-ui", "bootstrap", "Lodash"],
            databases: ["IndexedDB"],
          },
        },
      },
      {
        name: ["Service Desk"],
        company: ["System integrator"],
        date: { from: "2021-05-01", to: "2021-07-01" },
        types: ["admin panel"],
        stack: {
          frontend: {
            langs: ["Typescript"],
            tools: ["vue-cli", "webpack"],
            libs: ["Vue", "Tailwindcss", "i18n"],
          },
          disign: [],
        },
      },
      {
        name: ["Graph Visualization Library"],
        company: ["BaltInfoCom"],
        types: ["admin panel"],
        stack: {
          frontend: {
            langs: ["Typescript", "GLSL", "css", "svg"],
            tools: ["Rollup"],
            libs: ["Tree.js", "d3", "web-gl", "d3-quad-three"],
          },
        },
      },
      {
        name: ["Rule Engine"],
        types: ["lib", "docs"],
        stack: {
          "cross-platform": {
            langs: ["Typescript"],
            tools: ["Docusaurus", "Gulp"],
          },
        },
      },
      {
        name: ["Octopus / Universal Data Analysis Platform"],
        company: ["BaltInfoCom"],
        types: ["web app", "on-prem"],
        stack: {
          backend: {
            langs: ["Java", "Cypher", "Elastic DSL"],
            tools: ["Maven"],
            libs: ["Spring"],
            databases: ["Neo4j"],
          },
          frontend: {
            langs: ["Typescript", "Javascript", "css"],
            tools: ["Bower", "RequireJS"],
            libs: ["Durandal", "Vue", "Knockout", "Lodash", "JQuery"],
          },
        },
      },
      {
        name: ["Facebook crawler"],
        company: ["BaltInfoCom"],
        stack: {
          frontend: {
            langs: ["Typescript", "css"],
            tools: [],
            libs: [],
          },
          backend: {
            langs: ["Typescript"],
            tools: ["Electron", "Nightmare.js", "Puppeteer"],
            libs: [],
            databases: ["Neo4j"],
          },
        },
      },
      {
        name: ["Partner Cabinet"],
        company: ["Homework"],
        types: ["admin panel"],
        stack: {
          backend: {
            langs: ["C#", "TSQL"],
            tools: ["ASP.NET"],
            libs: ["NHibernate"],
            databases: ["MSSQL"],
          },
          frontend: {
            langs: ["Typescript", "scss"],
            libs: ["Angular 4+", "Highcharts"],
            tools: ["angular-cli"],
          },
        },
      },
      {
        name: ["Custom CRM/BPMS/CMS"],
        company: ["Homework"],
        types: ["back-offce"],
        stack: {
          backend: {
            over: ["DDD", "BEM"],
            langs: ["C#", "TSQL"],
            tools: ["ASP.NET"],
            libs: ["NHibernate"],
            databases: ["MSSQL"],
          },
          frontend: {
            langs: ["ECMAScript 5", "scss"],
            libs: ["JQuery"],
            tools: ["SST"],
          },
        },
      },
      {
        name: [
          "Homework",
          "Yougrade",
          "Sciterm",
          "Myknow",
          ...Array.from(new Array(5), () => "20+ landing pages"),
        ],
        types: ["seo-optimized website"],
        company: ["Homework"],
        stack: {
          backend: {
            over: ["DDD", "BEM"],
            langs: ["C#", "TSQL"],
            tools: ["ASP.NET"],
            libs: ["NHibernate"],
            databases: ["MSSQL"],
          },
          frontend: {
            langs: ["ECMAScript 3", "scss"],
            libs: ["JQuery"],
            tools: ["SST"],
          },
          disign: ["Photoshop", "Illustrator"],
        },
      },
      {
        name: ["Technobus"],
        types: ["web app", "mobile app"],
        company: ["Emergn"],
        stack: {
          backend: {
            langs: ["Java"],
            tools: ["Spring"],
            databases: ["Postgress", "Google Sheets"],
          },
          android: {
            langs: ["Java"],
          },
          frontend: {
            langs: ["Javascript", "scss"],
            libs: ["JQuery"],
            tools: ["Gulp"],
          },
          disign: ["AdobeXD"],
        },
      },
      {
        name: ["MyEco.city"],
        types: ["website"],
        stack: {
          backend: {
            langs: ["PHP"],
            libs: ["Twig", "Symfony"],
            databases: ["MySQL"],
            tools: ["composer"],
          },
          frontend: {
            over: ["BEM"],
            langs: ["Javascript", "css"],
            libs: ["JQuery"],
            tools: ["Gulp"],
          },
        },
      },
      {
        name: ["Artist’s promo"],
        types: ["website"],
        stack: {
          frontend: {
            langs: ["Javascript"],
            libs: ["JQuery"],
          },
        },
      },
      {
        name: ["Kompas Plagins"],
        types: ["desktop"],
        stack: {
          desktop: {
            langs: ["C#"],
            libs: ["Windows Forms", "Kompas"],
          },
        },
      },
    ],
  };
}
main();
