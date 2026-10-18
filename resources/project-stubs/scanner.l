%{
#include <stdlib.h>
#include "parser.tab.h"
%}

%option noyywrap

%%
[0-9]+    { yylval = atoi(yytext); return NUMBER; }
\n        { return EOL; }
[ \t]+    { /* ignora espacios */ }
.         { return yytext[0]; }
%%