import { BaseGenerator, ComponentLibrary } from './base-generator.js';
import type { IGeneratedFile, IDesignContext, Architecture, StateManagement, Framework } from '../types.js';
import { createLogger } from '../logger.js';

const _logger = createLogger('angular-generator');

/**
 * Angular Generator - Generates Angular components and projects
 */
export class AngularGenerator extends BaseGenerator {
  constructor(framework: Framework) {
    super(framework);
  }

  generateProject(
    projectName: string,
    _architecture: Architecture,
    _stateManagement: StateManagement,
    designContext: IDesignContext
  ): IGeneratedFile[] {
    this.logStart('project', projectName);

    const files: IGeneratedFile[] = [];

    const deps: Record<string, string> = {
      '@angular/animations': '^19.0.0',
      '@angular/common': '^19.0.0',
      '@angular/compiler': '^19.0.0',
      '@angular/core': '^19.0.0',
      '@angular/forms': '^19.0.0',
      '@angular/platform-browser': '^19.0.0',
      '@angular/platform-browser-dynamic': '^19.0.0',
      '@angular/router': '^19.0.0',
      rxjs: '^7.8.0',
      tslib: '^2.7.0',
      'zone.js': '^0.15.0',
    };
    const devDeps: Record<string, string> = {
      '@angular/cli': '^19.0.0',
      '@angular/compiler-cli': '^19.0.0',
      '@angular-devkit/build-angular': '^19.0.0',
      tailwindcss: '^4.0.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0',
    };
    files.push({
      path: 'package.json',
      content: this.createPackageJson(projectName, deps, devDeps),
    });

    files.push({
      path: 'tsconfig.json',
      content: JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'ES2022',
            moduleResolution: 'bundler',
            strict: true,
            noEmit: false,
            declaration: false,
            experimentalDecorators: true,
            lib: ['ES2022', 'DOM'],
            skipLibCheck: true,
            paths: { '@/*': ['./src/*'] },
          },
          angularCompilerOptions: {
            enableI18nLegacyMessageIdFormat: false,
            strictInjectionParameters: true,
            strictInputAccessModifiers: true,
            strictTemplates: true,
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: 'angular.json',
      content: JSON.stringify(
        {
          $schema: './node_modules/@angular/cli/lib/config/schema.json',
          version: 1,
          newProjectRoot: 'projects',
          projects: {
            [projectName]: {
              projectType: 'application',
              root: '',
              sourceRoot: 'src',
              architect: {
                build: {
                  builder: '@angular-devkit/build-angular:application',
                  options: {
                    outputPath: `dist/${projectName}`,
                    index: 'src/index.html',
                    browser: 'src/main.ts',
                    tsConfig: 'tsconfig.json',
                    styles: ['src/styles.css'],
                  },
                },
                serve: {
                  builder: '@angular-devkit/build-angular:dev-server',
                },
              },
            },
          },
        },
        null,
        2
      ),
    });

    const primary = designContext.colorPalette?.primary ?? '#3b82f6';
    files.push({
      path: 'tailwind.config.ts',
      content: `import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: { primary: '${primary}' },
    },
  },
  plugins: [],
} satisfies Config;
`,
    });

    files.push({
      path: 'src/index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
`,
    });

    files.push({
      path: 'src/main.ts',
      content: `import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
`,
    });

    files.push({
      path: 'src/styles.css',
      content: '@import "tailwindcss";\n',
    });

    files.push({
      path: 'src/app/app.component.ts',
      content: `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: \`
    <div class="min-h-screen bg-background text-foreground">
      <router-outlet />
    </div>
  \`,
})
export class AppComponent {
  title = '${projectName}';
}
`,
    });

    files.push({
      path: 'src/app/app.routes.ts',
      content: `import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
];
`,
    });

    files.push({
      path: 'src/app/home/home.component.ts',
      content: `import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: \`
    <main class="mx-auto max-w-4xl px-4 py-12">
      <h1 class="text-3xl font-bold tracking-tight">
        ${projectName}
      </h1>
      <p class="mt-2 text-muted-foreground">
        Angular project scaffolded by Siza.
      </p>
    </main>
  \`,
})
export class HomeComponent {}
`,
    });

    files.push({
      path: 'README.md',
      content: `# ${projectName}\n\nAngular 19 + TypeScript project generated by Siza.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm start\n\`\`\`\n`,
    });

    this.logComplete('project', projectName, files.length);
    return files;
  }

  generateComponent(
    componentType: string,
    props: Record<string, unknown>,
    designContext: IDesignContext,
    componentLibrary?: ComponentLibrary
  ): IGeneratedFile[] {
    this.logStart('component', componentType);

    const componentName = this.formatComponentName(componentType);
    const files: IGeneratedFile[] = [];

    // Component file
    files.push(this.createComponentFile(componentName, componentType, props, designContext, componentLibrary));

    // Test file
    files.push(this.createTestFile(componentName, componentType, designContext, componentLibrary));

    this.logComplete('component', componentType, files.length);
    return files;
  }

  // Component Library Implementation Methods

  protected getShadcnDependencies(): string[] {
    return ['@radix-ui/themes', 'class-variance-authority'];
  }

  protected getRadixDependencies(): string[] {
    return ['@radix-ui/themes'];
  }

  protected getHeadlessUIDependencies(): string[] {
    return ['@headlessui/tailwindcss'];
  }

  protected getPrimeVueDependencies(): string[] {
    return [];
  }

  protected getMaterialDependencies(): string[] {
    return ['@angular/material'];
  }

  protected getShadcnImports(): string[] {
    return [];
  }

  protected getRadixImports(): string[] {
    return [];
  }

  protected getHeadlessUIImports(): string[] {
    return [];
  }

  protected getPrimeVueImports(): string[] {
    return [];
  }

  protected getMaterialImports(): string[] {
    return [];
  }

  protected generateShadcnComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4 bg-white rounded-lg shadow-md max-w-md">
      <h2 class="text-xl font-bold mb-2">${componentName}</h2>
      <p class="text-muted-foreground mb-4">A ${componentType.toLowerCase()} component using shadcn/ui styles</p>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">Click me</button>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  label = '${componentName}';
  isVisible = true;

  toggle(): void {
    this.isVisible = !this.isVisible;
  }
}`;
  }

  protected generateRadixComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4">
      <button (click)="openDialog()" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">${componentName}</button>
      <div *ngIf="isDialogOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-card p-6 rounded-lg shadow-lg border max-w-md">
          <h3 class="text-lg font-bold mb-2">${componentName}</h3>
          <p class="text-muted-foreground mb-4">A ${componentType.toLowerCase()} component using Radix UI patterns</p>
          <button (click)="closeDialog()" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  isDialogOpen = false;

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }
}`;
  }

  protected generateHeadlessUIComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4">
      <button (click)="toggleDialog()" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">${componentName}</button>
      <div *ngIf="isDialogOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-card p-6 rounded-lg shadow-lg border max-w-md">
          <h3 class="text-lg font-bold mb-2">${componentName}</h3>
          <p class="text-muted-foreground mb-4">A ${componentType.toLowerCase()} component using Headless UI patterns</p>
          <button (click)="toggleDialog()" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  isDialogOpen = false;

  toggleDialog() {
    this.isDialogOpen = !this.isDialogOpen;
  }
}`;
  }

  protected generatePrimeVueComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4">
      <button (click)="openDialog()" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
        <i class="fas fa-plus mr-2"></i>${componentName}
      </button>
      <div *ngIf="isDialogOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div class="bg-card p-6 rounded-lg shadow-lg border max-w-md">
          <h3 class="text-lg font-bold mb-2">${componentName}</h3>
          <p class="text-muted-foreground mb-4">A ${componentType.toLowerCase()} component using PrimeVue styles</p>
          <button (click)="closeDialog()" class="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">
            <i class="fas fa-times mr-2"></i>Close
          </button>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  isDialogOpen = false;

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }
}`;
  }

  protected generateMaterialComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4">
      <mat-button (click)="openDialog()" color="primary" raised>${componentName}</mat-button>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(DialogContentComponent, {
      data: { title: '${componentName}', message: 'A ${componentType.toLowerCase()} component using Material Design' }
    });
  }
}

@Component({
  selector: 'dialog-content',
  template: \`
    <div class="bg-white p-6 rounded-lg">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <div mat-dialog-content>{{ data.message }}</div>
      <div mat-dialog-actions>
        <button mat-button (click)="dialogRef.close()">Close</button>
      </div>
    </div>
  \`
})
export class DialogContentComponent {
  constructor(public dialogRef: any) {}
}`;
  }

  protected generateTailwindComponent(componentType: string, _props: Record<string, unknown>): string {
    const componentName = this.formatComponentName(componentType);

    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentType}',
  template: \`
    <div class="p-4 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">${componentName}</h2>
      <p class="text-muted-foreground mb-4">A ${componentType.toLowerCase()} component using Tailwind CSS</p>
      <button
        class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
        (click)="handleClick()"
      >
        Click me
      </button>
    </div>
  \`,
  styles: [\`
    :host {
      display: block;
    }
  \`]
})
export class ${componentName}Component {
  handleClick() {
    console.log('Button clicked');
  }
}`;
  }

  private createComponentFile(
    componentName: string,
    componentType: string,
    props: Record<string, unknown>,
    designContext: IDesignContext,
    componentLibrary?: ComponentLibrary
  ): IGeneratedFile {
    let content: string;

    if (componentLibrary && componentLibrary !== 'none') {
      content = this.generateComponentLibraryCode(componentType, props, componentLibrary);
    } else {
      content = this.generateTailwindComponent(componentType, props);
    }

    return {
      path: `src/app/components/${componentName}.component.ts`,
      content,
    };
  }

  private createTestFile(
    componentName: string,
    componentType: string,
    _designContext: IDesignContext,
    _componentLibrary?: ComponentLibrary
  ): IGeneratedFile {
    const content = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ${componentName}Component } from './${componentName}.component';

describe('${componentName}Component', () => {
  let component: ${componentName}Component;
  let fixture: ComponentFixture<${componentName}Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${componentName}Component]
    }).compileComponents();

    fixture = TestBed.createComponent(${componentName}Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component type', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain('${componentType.toLowerCase()}');
  });
});
`;

    return {
      path: `src/app/components/${componentName}.component.spec.ts`,
      content,
    };
  }
}
