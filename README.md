# angular-codespace
Codespace for trying out angular concepts

Here’s a straightforward way to create and run an **Angular 21** project in Codespaces.

1. **Create a GitHub repository**  
   On GitHub, create a new repository, give it a name such as `angular-learning`, and initialize it with a README. This gives Codespaces a non-empty branch to work from.

2. **Open a Codespace**  
   On the repository page, click **Code → Codespaces → Create codespace on main**. Choose the smallest available machine type to keep usage low. Codespaces opens VS Code in your browser once its cloud environment is ready. <citation src="1,2"></citation>

3. **Create the Angular project**  
   In the Codespace, open **Terminal → New Terminal** and run:

   ```bash
   node --version
   npm --version
   npx @angular/cli new my-angular-app
   ```

   The CLI may ask whether to enable features or select a stylesheet format; choose the defaults to get started. If prompted to install the Angular CLI package, answer `y`.

4. **Start the app**

   ```bash
   cd my-angular-app
   npx ng serve --host 0.0.0.0
   ```

   When Codespaces detects the running app, open the **Ports** tab in the bottom panel and click the globe icon for the forwarded port—usually **4200**. You should see the Angular starter page in a new browser tab. Codespaces forwards application ports so you can view apps running inside the cloud environment. <citation src="2"></citation>

5. **Save your work to GitHub**  
   In the left-side **Source Control** panel, enter a commit message, click **Commit**, then **Sync Changes** or **Push** to save your project to the repository.

When you finish, stop the Codespace from the Codespaces menu. A stopped Codespace can still use storage, so delete it when you’re sure you no longer need it. <citation src="1"></citation>
