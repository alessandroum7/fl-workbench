%{
#include <stdio.h>

int yylex(void);
void yyerror(const char *s);
%}

%token NUMBER EOL
%left '+' '-'
%left '*' '/'

%%
input:
      /* vacío */
    | input line
    ;

line:
      EOL
    | exp EOL      { printf("= %d\n", $1); }
    ;

exp:
      NUMBER
    | exp '+' exp  { $$ = $1 + $3; }
    | exp '-' exp  { $$ = $1 - $3; }
    | exp '*' exp  { $$ = $1 * $3; }
    | exp '/' exp  {
          if ($3 == 0) { yyerror("division por cero"); $$ = 0; }
          else $$ = $1 / $3;
      }
    | '(' exp ')'  { $$ = $2; }
    ;
%%

int main(void) {
    return yyparse();
}

void yyerror(const char *s) {
    fprintf(stderr, "error: %s\n", s);
}