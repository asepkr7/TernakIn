import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NewsLater = () => {
  return (
    <div className="">
      <section className="relative h-[600px] bg-[url('https://images.unsplash.com/photo-1633616669488-d17df6d759a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxmYXJtZXIlMjB3aXRoJTIwY293fGVufDB8fDB8fHww')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/20">
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl text-white mb-8 max-w-4xl">
              Join the Livestock Management Revolution
            </h2>

            <form className="w-full max-w-lg flex gap-2 bg-white rounded-full p-2">
              <Input
                type="email"
                placeholder="Your email address"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-800 rounded-full px-6"
              >
                Join Now
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
